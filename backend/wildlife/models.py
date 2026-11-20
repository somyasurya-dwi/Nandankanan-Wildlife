from django.db import models
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
