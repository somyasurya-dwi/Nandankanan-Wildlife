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
    reset_password,
    send_email_otp,
    verify_email_otp,
    tiger_tracking_status,
    create_subscription_order,
    verify_subscription_payment,
    check_subscription_status,
    track_preview_usage,
    wallet_details,
    create_wallet_topup_order,
    verify_wallet_topup,
    make_wildlife_contribution,
    get_recent_contributions,
    like_community_moment,
    get_wallet_transactions,
    get_animal_care_fund,
    get_animal_reactions,
    send_animal_reaction
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
    path('auth/send-email-otp/', send_email_otp, name='auth-send-email-otp'),
    path('auth/verify-email-otp/', verify_email_otp, name='auth-verify-email-otp'),
    path('auth/register/', register_user, name='auth-register'),
    path('auth/login/', login_user, name='auth-login'),
    path('auth/logout/', logout_user, name='auth-logout'),
    path('auth/me/', current_user, name='auth-me'),
    path('auth/profile/', current_user, name='auth-profile'),
    path('auth/forgot-password/', forgot_password, name='auth-forgot-password'),
    path('auth/reset-password/', reset_password, name='auth-reset-password'),
    path('save_frame/', save_frame, name='save-frame'),
    path('tracking/tiger/', tiger_tracking_status, name='tiger-tracking-status'),
    path('subscription/create-order/', create_subscription_order, name='create-subscription-order'),
    path('subscription/verify/', verify_subscription_payment, name='verify-subscription-payment'),
    path('subscription/status/', check_subscription_status, name='check-subscription-status'),
    path('subscription/preview-usage/', track_preview_usage, name='track-preview-usage'),
    # Wildlife Wallet & Contribution API
    path('wallet/', wallet_details, name='wallet-details'),
    path('wallet/topup/create-order/', create_wallet_topup_order, name='wallet-topup-create-order'),
    path('wallet/topup/verify/', verify_wallet_topup, name='wallet-topup-verify'),
    path('wallet/contribute/', make_wildlife_contribution, name='wallet-make-contribution'),
    path('wallet/contributions/', get_recent_contributions, name='wallet-recent-contributions'),
    path('wallet/contributions/<str:contribution_id>/like/', like_community_moment, name='wallet-like-contribution'),
    path('wallet/transactions/', get_wallet_transactions, name='wallet-transactions'),
    path('wallet/fund-stats/', get_animal_care_fund, name='wallet-fund-stats'),
    # Dynamic Animal Reactions API
    path('reactions/<slug:animal_slug>/', get_animal_reactions, name='animal-reactions'),
    path('reactions/<slug:animal_slug>/send/', send_animal_reaction, name='send-animal-reaction'),
]

