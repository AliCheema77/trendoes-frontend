from django.urls import path, include
from . import views
from rest_framework import routers
from django.conf import settings # Import settings
from django.conf.urls.static import static # Import static helper

router = routers.DefaultRouter()

router.register(r'users', views.UserView)
router.register(r'category', views.CategoryView)
router.register(r'SubCategory', views.SubCategoryView)
router.register(r'colors', views.ColorsView)
router.register(r'sizes', views.SizeView)
router.register(r'brands', views.BrandsView)
router.register(r'products', views.ProductView)


urlpatterns = [
    path('', include(router.urls)),
]


# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)