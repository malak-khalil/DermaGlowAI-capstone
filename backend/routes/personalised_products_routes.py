from flask import Blueprint, request, jsonify
from models import Product

personalised_products_bp = Blueprint(
    "personalised_products",
    __name__,
    url_prefix="/api/personalised-products"
)


def normalize_text(value):
    return str(value).strip().lower() if value is not None else ""


def split_csv(value):
    if not value:
        return []
    return [item.strip().lower() for item in str(value).split(",") if item.strip()]


def get_product_field(product, *names):
    for name in names:
        if hasattr(product, name):
            return getattr(product, name)
    return None


def canonical_category(value):
    value = normalize_text(value)

    if value in ["cleanser", "cleansers"]:
        return "cleanser"
    if value in ["serum", "serums"]:
        return "serum"
    if value in ["moisturiser", "moisturizer", "moisturizers", "moisturisers"]:
        return "moisturiser"
    if value in ["sunscreen", "sun screen", "spf", "sun care"]:
        return "sunscreen"

    return value


def age_to_number(age_answer):
    mapping = {
        "below 20": 18,
        "20-30": 25,
        "31-40": 35,
        "above 40": 45
    }
    return mapping.get(normalize_text(age_answer), 25)


def ingredient_bonus(primary_concern, skin_type, ingredients_text):
    ingredients = normalize_text(ingredients_text)
    bonus = 0

    concern_ingredient_map = {
        "acne": ["salicylic acid", "niacinamide", "zinc", "tea tree"],
        "blackheads": ["salicylic acid", "bha", "niacinamide"],
        "dark spots": ["vitamin c", "niacinamide", "alpha arbutin", "tranexamic", "kojic"],
        "pores": ["niacinamide", "bha", "salicylic acid"],
        "wrinkles": ["retinol", "peptides", "hyaluronic acid", "collagen"]
    }

    skin_type_map = {
        "oily": ["niacinamide", "salicylic acid", "zinc"],
        "dry": ["ceramide", "glycerin", "hyaluronic acid", "squalane"],
        "combination": ["niacinamide", "hyaluronic acid"],
        "normal": ["hyaluronic acid", "niacinamide"],
        "sensitive": ["ceramide", "panthenol", "aloe", "centella"]
    }

    for keyword in concern_ingredient_map.get(primary_concern, []):
        if keyword in ingredients:
            bonus += 2

    for keyword in skin_type_map.get(skin_type, []):
        if keyword in ingredients:
            bonus += 1

    return bonus


def build_routine(selected_products, makeup, sunlight_exposure):
    cleanser = selected_products.get("cleanser")
    serum = selected_products.get("serum")
    moisturiser = selected_products.get("moisturiser")
    sunscreen = selected_products.get("sunscreen")

    morning = []
    evening = []

    if cleanser:
        morning.append(f"Cleanse with {cleanser['name']}.")
        if normalize_text(makeup) in ["yes, daily", "occasionally"]:
            evening.append(
                f"Cleanse well at night with {cleanser['name']} to remove buildup and makeup."
            )
        else:
            evening.append(f"Cleanse with {cleanser['name']} at night.")

    if serum:
        morning.append(f"Apply {serum['name']} to target your main skin concern.")
        evening.append(f"Use {serum['name']} again in the evening if your skin tolerates it.")

    if moisturiser:
        morning.append(f"Moisturise with {moisturiser['name']}.")
        evening.append(f"Lock in hydration with {moisturiser['name']}.")

    if sunscreen:
        morning.append(f"Finish with {sunscreen['name']} every morning.")
        if normalize_text(sunlight_exposure) in ["daily for 1-2 hours", "daily for 3+ hours"]:
            morning.append("Reapply sunscreen during the day when exposed to sunlight.")

    return {
        "morning": morning,
        "evening": evening
    }


@personalised_products_bp.route("/", methods=["POST"])
def get_personalised_products():
    data = request.get_json()
    if data.get("skinConcern") == "normal":
        concern = "normal"
    else:
        concern = data.get("skinConcern", "").lower().replace(" ", "_")
    gender = normalize_text(data.get("gender"))
    age_answer = data.get("age")
    primary_concern = normalize_text(data.get("skinConcern"))
    skin_type = normalize_text(data.get("skinType"))
    sunlight_exposure = normalize_text(data.get("sunExposure"))
    makeup = normalize_text(data.get("makeup"))

    user_age = age_to_number(age_answer)

    all_products = Product.query.all()
    scored_products = []

    for product in all_products:
        score = 0

        product_category = canonical_category(
            get_product_field(product, "category")
        )

        product_concern = normalize_text(
            get_product_field(product, "skin_concern", "skinConcern")
        )

        product_gender = normalize_text(
            get_product_field(product, "gender_target", "gender", "genderTarget")
        )

        product_skin_types = split_csv(
            get_product_field(product, "skin_type", "skinType", "skin_types")
        )

        product_tags = split_csv(
            get_product_field(product, "concern_tags", "concernTags", "tags")
        )

        product_ingredients = normalize_text(
            get_product_field(product, "ingredients", "ingredient_list")
        )

        if product_concern == primary_concern:
            score += 10

        if primary_concern in product_tags:
            score += 6

        if skin_type in product_skin_types:
            score += 7

        if "all" in product_skin_types or "all skin" in product_skin_types:
            score += 2

        if product_gender in ["unisex", "all", "all genders", ""]:
            score += 3
        elif gender and gender != "prefer not to answer" and product_gender == gender:
            score += 4

        product_age_min = get_product_field(product, "age_min", "ageMin")
        product_age_max = get_product_field(product, "age_max", "ageMax")

        if product_age_min is not None and product_age_max is not None:
            if int(product_age_min) <= user_age <= int(product_age_max):
                score += 4

        score += ingredient_bonus(primary_concern, skin_type, product_ingredients)

        if product_category == "sunscreen":
            if sunlight_exposure == "rarely":
                score += 2
            elif sunlight_exposure == "occasionally":
                score += 4
            elif sunlight_exposure == "daily for 1-2 hours":
                score += 7
            elif sunlight_exposure == "daily for 3+ hours":
                score += 10

        if product_category == "cleanser" and makeup in ["yes, daily", "occasionally"]:
            score += 6

        if product_category == "moisturiser" and skin_type in ["dry", "sensitive"]:
            score += 4

        if product_category == "serum" and primary_concern in [
            "acne", "dark spots", "wrinkles", "pores", "blackheads"
        ]:
            score += 4

        scored_products.append({
            "id": get_product_field(product, "id"),
            "category": get_product_field(product, "category"),
            "skin_concern": get_product_field(product, "skin_concern", "skinConcern"),
            "name": get_product_field(product, "name"),
            "description": get_product_field(product, "description"),
            "price": float(get_product_field(product, "price") or 0),
            "image": get_product_field(product, "image", "image_path", "imagePath"),
            "brand": get_product_field(product, "brand"),
            "gender_target": get_product_field(product, "gender_target", "gender", "genderTarget"),
            "age_min": get_product_field(product, "age_min", "ageMin"),
            "age_max": get_product_field(product, "age_max", "ageMax"),
            "skin_type": get_product_field(product, "skin_type", "skinType", "skin_types"),
            "concern_tags": get_product_field(product, "concern_tags", "concernTags", "tags"),
            "ingredients": get_product_field(product, "ingredients", "ingredient_list"),
            "score": score
        })

    scored_products.sort(key=lambda x: x["score"], reverse=True)

    best_by_category = {
        "cleanser": None,
        "serum": None,
        "moisturiser": None,
        "sunscreen": None
    }

    for product in scored_products:
        category = canonical_category(product["category"])
        if category in best_by_category and best_by_category[category] is None:
            best_by_category[category] = product

    recommended_products = [
        best_by_category["cleanser"],
        best_by_category["serum"],
        best_by_category["moisturiser"],
        best_by_category["sunscreen"]
    ]

    recommended_products = [product for product in recommended_products if product is not None]

    selected_products = {}
    for product in recommended_products:
        selected_products[canonical_category(product["category"])] = product

    routine = build_routine(selected_products, makeup, sunlight_exposure)

    return jsonify({
        "recommended_products": recommended_products,
        "routine": routine
    })