from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AnimalViewSet,
    LiveCameraViewSet,
    MapMarkerViewSet,
    SponsorshipViewSet,
    ConservationStoryViewSet,
    park_stats,
    demo_auth,
    save_frame,
    register_user,
    login_user,
    logout_user,
    current_user,
    forgot_password,
    reset_password
)

router = DefaultRouter()
router.register(r'animals', AnimalViewSet, basename='animal')
router.register(r'cameras', LiveCameraViewSet, basename='camera')
router.register(r'markers', MapMarkerViewSet, basename='marker')
router.register(r'sponsorships', SponsorshipViewSet, basename='sponsorship')
router.register(r'stories', ConservationStoryViewSet, basename='story')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', park_stats, name='park-stats'),
    path('auth/', demo_auth, name='demo-auth'),
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('auth/logout/', logout_user, name='auth-logout'),
    path('auth/me/', current_user, name='auth-me'),
    path('auth/profile/', current_user, name='auth-profile'),
    path('auth/forgot-password/', forgot_password, name='auth-forgot-password'),
    path('auth/reset-password/', reset_password, name='auth-reset-password'),
    path('save_frame/', save_frame, name='save-frame'),
]

