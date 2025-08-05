from rest_framework import serializers
from .models import Product, Image, Stock

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image']


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'size', 'color', 'quantity']

class ProductSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only = True)
    stocks = StockSerializer(many=True, read_only = True)
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'subcategory', 'gender',
            'brand', 'color', 'description', 'actual_price',
            'discount_percent', 'price', 'images', 'stocks'
        ]
        read_only_fields = ['price']