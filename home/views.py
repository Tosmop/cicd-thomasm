from django.shortcuts import redirect
from django.views.generic import ListView
from products.models import Product


def RedirectHomeView(request):
    '''
    Redirect url from '/' to '/home/'
    '''
    return redirect('home')


class HomeView(ListView):
    '''
    Renders home page with all the products
    '''
    template_name = 'home.html'
    model = Product
    context_object_name = 'object_list'

    def get_queryset(self):
        queryset = super().get_queryset()
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        sort_order = self.request.GET.get('sort')

        # Filtrage par prix
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Tri par ordre croissant ou décroissant
        if sort_order == 'asc':
            queryset = queryset.order_by('price')
        elif sort_order == 'desc':
            queryset = queryset.order_by('-price')

        return queryset
