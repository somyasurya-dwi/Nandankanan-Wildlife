from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
import uuid

CATEGORY_CHOICES = [
    ('Mammals', 'Mammals'),
    ('Birds', 'Birds'),
    ('Reptiles', 'Reptiles'),
    ('Aquatic Animals', 'Aquatic Animals'),
]

STATUS_CHOICES = [
    ('Critically Endangered', 'Critically Endangered'),
    ('Endangered', 'Endangered'),
    ('Vulnerable', 'Vulnerable'),
    ('Near Threatened', 'Near Threatened'),
    ('Least Concern', 'Least Concern'),
]

STREAM_STATUS_CHOICES = [
    ('LIVE', 'LIVE'),
    ('OFFLINE', 'OFFLINE'),
    ('MAINTENANCE', 'MAINTENANCE'),
]

class Animal(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    scientific_name = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Mammals')
    habitat = models.CharField(max_length=200)
    conservation_status = models.CharField(max_length=60, choices=STATUS_CHOICES, default='Endangered')
    diet = models.CharField(max_length=200, default='Carnivore')
    lifespan = models.CharField(max_length=80, default='15-20 years')
    weight_range = models.CharField(max_length=80, default='180 - 260 kg')
    short_description = models.TextField()
    full_bio = models.TextField()
    fun_facts = models.JSONField(default=list, blank=True)
    photo_url = models.CharField(max_length=500)
    video_url = models.CharField(max_length=500, blank=True)
    audio_type = models.CharField(max_length=80, default='tiger')
    featured = models.BooleanField(default=False)
    sponsorship_available = models.BooleanField(default=True)
    monthly_sponsorship_cost = models.IntegerField(default=5000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.scientific_name})"

    class Meta:
        ordering = ['name']


class LiveCamera(models.Model):
    title = models.CharField(max_length=150)
    animal_name = models.CharField(max_length=100)
    habitat_name = models.CharField(max_length=150)
    stream_url = models.CharField(max_length=500)
    video_type = models.CharField(max_length=50, default='demo_video')
    status = models.CharField(max_length=20, choices=STREAM_STATUS_CHOICES, default='LIVE')
    viewer_count = models.IntegerField(default=1240)
    thumbnail_url = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    camera_location = models.CharField(max_length=150, default='Enclosure Observation Tower')
    active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - [{self.status}]"

    class Meta:
        ordering = ['order', 'id']


class MapMarker(models.Model):
    MARKER_CATEGORIES = [
        ('animal_habitat', 'Animal Habitat'),
        ('safari_zone', 'Safari Zone'),
        ('camera_location', 'Live Camera Location'),
        ('visitor_facility', 'Visitor Facility'),
        ('water_body', 'Water Body / Wetland'),
    ]

    title = models.CharField(max_length=150)
    animal_name = models.CharField(max_length=150, blank=True, default='')
    category = models.CharField(max_length=50, choices=MARKER_CATEGORIES)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()
    badge_text = models.CharField(max_length=50, blank=True)
    icon_name = models.CharField(max_length=50, default='MapPin')
    photo_url = models.CharField(max_length=500, blank=True)
    emoji = models.CharField(max_length=20, default='🐾')
    animal_slug = models.CharField(max_length=160, blank=True)
    stream_url = models.CharField(max_length=500, blank=True, default='')
    camera_id = models.IntegerField(null=True, blank=True)
    map_x = models.IntegerField(default=500)
    map_y = models.IntegerField(default=260)
    surrounding_place = models.CharField(max_length=255, blank=True, default='')
    nearby_landmarks = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f"{self.title} ({self.category})"


class Sponsorship(models.Model):
    TIER_CHOICES = [
        ('Silver Defender', 'Silver Defender - ₹2,500/mo'),
        ('Gold Guardian', 'Gold Guardian - ₹5,000/mo'),
        ('Platinum Champion', 'Platinum Champion - ₹15,000/mo'),
    ]

    donor_name = models.CharField(max_length=150)
    donor_email = models.EmailField()
    donor_phone = models.CharField(max_length=20, blank=True)
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name='sponsorships')
    tier = models.CharField(max_length=50, choices=TIER_CHOICES)
    duration_months = models.IntegerField(default=12)
    amount = models.IntegerField()
    certificate_id = models.CharField(max_length=60, unique=True, blank=True)
    personal_message = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            self.certificate_id = f"NKZ-2026-{uuid.uuid4().hex[:6].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Sponsorship {self.certificate_id} - {self.donor_name} ({self.animal.name})"


class ConservationStory(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    category = models.CharField(max_length=80, default='Conservation Breakthrough')
    cover_image = models.CharField(max_length=500)
    author = models.CharField(max_length=100, default='Nandankanan Research & Field Team')
    read_time = models.CharField(max_length=30, default='4 min read')
    summary = models.TextField()
    content = models.TextField()
    published_date = models.DateField(auto_now_add=True)
    featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Conservation Stories'
        ordering = ['-published_date', '-id']


class LiveStreamSubscription(models.Model):
    subscription_id = models.CharField(max_length=60, unique=True)
    user_email = models.EmailField(blank=True, default='visitor@nandankanan.org')
    user_name = models.CharField(max_length=150, blank=True, default='Wildlife Enthusiast')
    plan_name = models.CharField(max_length=150, default='Unlimited Wildlife Live Streaming (30 Days)')
    amount = models.IntegerField(default=100) # In INR (₹100)
    currency = models.CharField(max_length=10, default='INR')
    order_id = models.CharField(max_length=100, blank=True)
    payment_id = models.CharField(max_length=100, blank=True)
    signature = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=30, default='active') # active, expired, pending, failed
    is_active = models.BooleanField(default=True)
    is_demo = models.BooleanField(default=False)
    starts_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        from django.utils import timezone
        return self.is_active and self.status == 'active' and self.expires_at > timezone.now()

    def __str__(self):
        return f"Subscription {self.subscription_id} - ₹{self.amount} ({self.status}) [Demo: {self.is_demo}]"

    class Meta:
        ordering = ['-created_at']


class PreviewSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True)
    seconds_watched = models.FloatField(default=0.0)
    exhausted = models.BooleanField(default=False)
    last_active = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PreviewSession {self.session_id} - {self.seconds_watched:.1f}s (Exhausted: {self.exhausted})"


class WildlifeWallet(models.Model):
    wallet_id = models.CharField(max_length=60, unique=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='wildlife_wallets')
    session_id = models.CharField(max_length=100, db_index=True)
    user_name = models.CharField(max_length=150, default='Wildlife Enthusiast')
    user_email = models.EmailField(default='visitor@nandankanan.org')
    balance = models.IntegerField(default=150) # In INR (default balance ₹150 for immediate engagement)
    currency = models.CharField(max_length=10, default='INR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet {self.wallet_id} - ₹{self.balance} ({self.user_name})"

    class Meta:
        ordering = ['-updated_at']


class WalletTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('topup', 'Wallet Top-Up'),
        ('contribution', 'Wildlife Contribution'),
    )
    STATUS_CHOICES = (
        ('success', 'Success'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled')
    )
    transaction_id = models.CharField(max_length=60, unique=True)
    wallet = models.ForeignKey(WildlifeWallet, related_name='transactions', on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, default='topup')
    amount = models.IntegerField() # In INR
    balance_after = models.IntegerField(default=0)
    payment_method = models.CharField(max_length=50, default='razorpay') # wallet, razorpay, demo_gateway
    order_id = models.CharField(max_length=100, blank=True)
    payment_id = models.CharField(max_length=100, blank=True)
    signature = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='success')
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"TX {self.transaction_id} - {self.transaction_type} ₹{self.amount} ({self.status})"

    class Meta:
        ordering = ['-created_at']


class WildlifeContribution(models.Model):
    STATUS_CHOICES = (
        ('verified', 'Verified'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
    )
    contribution_id = models.CharField(max_length=60, unique=True)
    wallet = models.ForeignKey(WildlifeWallet, null=True, blank=True, on_delete=models.SET_NULL, related_name='contributions')
    donor_name = models.CharField(max_length=150, default='Wildlife Supporter')
    donor_email = models.EmailField(default='donor@nandankanan.org')
    is_anonymous = models.BooleanField(default=False)
    amount = models.IntegerField(default=50) # In INR (₹10, ₹50, ₹100, or custom)
    animal_slug = models.CharField(max_length=60) # 'royal-bengal-tiger', 'asiatic-lion', 'elephant', 'spotted-deer', 'sloth-bear', 'birds'
    animal_name = models.CharField(max_length=100) # 'Royal Bengal Tiger', 'Asiatic Lion', 'Elephant', etc.
    animal_emoji = models.CharField(max_length=10, default='🐾')
    program_description = models.CharField(max_length=255) # e.g. "Support approved meat and nutrition programs"
    personal_message = models.TextField(blank=True) # e.g. "Sending love to our majestic friends! ❤️"
    payment_method = models.CharField(max_length=50, default='wallet') # 'wallet', 'razorpay', 'demo_gateway'
    payment_id = models.CharField(max_length=100, blank=True)
    order_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='verified')
    is_verified = models.BooleanField(default=True)
    likes_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def display_donor_name(self):
        if self.is_anonymous:
            return "Anonymous Wildlife Friend"
        return self.donor_name

    def __str__(self):
        return f"Contribution {self.contribution_id} - ₹{self.amount} for {self.animal_name} by {self.display_donor_name}"

    class Meta:
        ordering = ['-created_at']


class AnimalReaction(models.Model):
    animal_slug = models.CharField(max_length=60, db_index=True)
    reaction_id = models.CharField(max_length=60, db_index=True)
    reaction_name = models.CharField(max_length=100, default='')
    count = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('animal_slug', 'reaction_id')
        ordering = ['-count']

    def __str__(self):
        return f"{self.animal_slug} - {self.reaction_id}: {self.count}"



