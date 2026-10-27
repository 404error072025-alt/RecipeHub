import json

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

User = get_user_model()


def user_payload(user):
    return {
        "id": user.id,
        "name": user.get_full_name() or user.username,
        "email": user.email,
    }


def read_json(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return None


@csrf_exempt
@require_POST
def register_view(request):
    data = read_json(request)
    if data is None:
        return JsonResponse({"message": "Invalid JSON request."}, status=400)

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return JsonResponse({"message": "Name, email and password are required."}, status=400)

    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse({"message": "Email is already registered."}, status=400)

    username = email
    if User.objects.filter(username=username).exists():
        return JsonResponse({"message": "An account already exists for this email."}, status=400)

    user = User(username=username, email=email, first_name=name)
    try:
        validate_password(password, user=user)
    except ValidationError as exc:
        return JsonResponse({"message": " ".join(exc.messages)}, status=400)

    user.set_password(password)
    user.save()
    login(request, user)
    return JsonResponse({"user": user_payload(user)}, status=201)


@csrf_exempt
@require_POST
def login_view(request):
    data = read_json(request)
    if data is None:
        return JsonResponse({"message": "Invalid JSON request."}, status=400)

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return JsonResponse({"message": "Email and password are required."}, status=400)

    user = authenticate(request, username=email, password=password)
    if user is None:
        return JsonResponse({"message": "Invalid email or password."}, status=401)

    login(request, user)
    return JsonResponse({"user": user_payload(user)})


@csrf_exempt
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully."})


@require_GET
def me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"user": None})
    return JsonResponse({"user": user_payload(request.user)})
