from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Product, Category, SubCategory, Color, Size, Gender, Brand, Image, Stock, Review
from .serializers import ProductSerializer
from .throttles import ProductListSellThrottle

class ProductListSellView(APIView):
    throttle_classes = [ProductListSellThrottle]

    def get(self, request):
        products = Product.objects.all()

        # Filtering by category, brand, and price range
        category = request.query_params.get('category')
        brand = request.query_params.get('brand')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        if category:
            products = products.filter(category=category)
        if brand:
            products = products.filter(brand=brand)
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)

        serializer = ProductSerializer(products, many=True, context={'request': request})
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        pass

