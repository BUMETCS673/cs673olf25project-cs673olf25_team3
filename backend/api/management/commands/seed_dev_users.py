from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Seed development users (idempotent): rachel.green and ross.geller"

    def handle(self, *args, **options):
        User = get_user_model()

        seeds = [
            {
                "username": "rachel.green",
                "first_name": "Rachel",
                "last_name": "Green",
                "email": "rachel.green@example.com",
                "password": "password123",
            },
            {
                "username": "ross.geller",
                "first_name": "Ross",
                "last_name": "Geller",
                "email": "ross.geller@example.com",
                "password": "password123",
            },
        ]

        created = []
        for s in seeds:
            user, created_flag = User.objects.get_or_create(username=s["username"], defaults={
                "first_name": s["first_name"],
                "last_name": s["last_name"],
                "email": s["email"],
            })
            if created_flag:
                user.set_password(s["password"])
                user.save()
                created.append(user.username)

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created users: {', '.join(created)}"))
            self.stdout.write("Password for seeded users is 'password123' (dev only).")
        else:
            self.stdout.write(self.style.NOTICE("Seed users already exist — no changes made."))
