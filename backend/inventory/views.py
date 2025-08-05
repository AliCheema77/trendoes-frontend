from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from .models import Product, Category, SubCategory, Color, Size, Gender, Brand, Image, Stock, Review
from .serializers import ProductSerializer

class ProductListSellView(APIView):
    def get(self, request):
        product = Product.objects.all()
        serializer = ProductSerializer(product, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK)
    def post(self, request):
        pass

