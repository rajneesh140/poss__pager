from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import models so SQLAlchemy knows them
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem