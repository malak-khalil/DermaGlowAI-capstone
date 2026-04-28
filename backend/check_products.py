# debug_db.py
import os
from app import app
from models import db, Product

print("=" * 50)
print("DATABASE DEBUG INFO")
print("=" * 50)

# Check the database file path
with app.app_context():
    db_path = db.engine.url.database
    print(f"\n📁 Database file being used by Python: {db_path}")
    print(f"   File exists: {os.path.exists(db_path)}")
    
    if os.path.exists(db_path):
        print(f"   File size: {os.path.getsize(db_path)} bytes")
        print(f"   Full path: {os.path.abspath(db_path)}")

# Check what tables exist
with app.app_context():
    from sqlalchemy import inspect
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    print(f"\n📊 Tables in database: {tables}")

# Count products by skin_concern
with app.app_context():
    print("\n📦 Products by skin_concern:")
    products = Product.query.all()
    print(f"   Total products: {len(products)}")
    
    concern_counts = {}
    for product in products:
        concern = product.skin_concern
        concern_counts[concern] = concern_counts.get(concern, 0) + 1
    
    for concern, count in concern_counts.items():
        print(f"   - {concern}: {count} products")
    
    # Specifically check for 'normal'
    normal_products = Product.query.filter_by(skin_concern='normal').all()
    print(f"\n✅ Products with 'normal' skin_concern: {len(normal_products)}")
    
    if len(normal_products) > 0:
        print("\n   First 5 normal products:")
        for p in normal_products[:5]:
            print(f"   - ID: {p.id}, Name: {p.name}, Category: {p.category}")