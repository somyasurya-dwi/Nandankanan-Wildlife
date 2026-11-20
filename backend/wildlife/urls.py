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
    save_frame
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
    path('save_frame/', save_frame, name='save-frame'),
]

