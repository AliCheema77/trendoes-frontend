from django import forms
from .models import Product, Category

class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        category = None

        # If bound form (POST)
        if 'category' in self.data:
            try:
                category_id = int(self.data.get('category'))
                category = Category.objects.get(id=category_id)
            except (ValueError, Category.DoesNotExist):
                pass
        elif self.instance.pk:
            category = self.instance.category

        if category and category.name.lower() == "perfume":
            self.fields['size'].widget = forms.HiddenInput()
            self.fields['color'].widget = forms.HiddenInput()
            self.fields['gender'].widget = forms.HiddenInput()
