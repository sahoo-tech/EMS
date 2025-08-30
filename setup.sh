#!/bin/bash

# Django Task Manager - Quick Setup Script

echo "🚀 Setting up Django Task Manager..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python found${NC}"

# Create virtual environment
echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
python3 -m venv venv

# Activate virtual environment
echo -e "${YELLOW}🔄 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pip install -r requirements.txt

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️ Creating .env file...${NC}"
    cat > .env << EOL
SECRET_KEY=django-insecure-$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
DEBUG=True
EOL
    echo -e "${GREEN}✅ .env file created${NC}"
fi

# Run migrations
echo -e "${YELLOW}🗄️ Setting up database...${NC}"
python manage.py makemigrations
python manage.py migrate

# Create superuser prompt
echo -e "${YELLOW}👤 Do you want to create a superuser? (y/n)${NC}"
read -r create_superuser
if [ "$create_superuser" = "y" ] || [ "$create_superuser" = "Y" ]; then
    python manage.py createsuperuser
fi

# Seed database
echo -e "${YELLOW}🌱 Seeding database with sample data...${NC}"
python manage.py seed_data --mode=refresh --users=10 --tasks=50

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Run: python manage.py runserver"
echo "2. Visit: http://127.0.0.1:8000/swagger/ for API docs"
echo "3. Visit: http://127.0.0.1:8000/admin/ for admin panel"
echo ""
echo -e "${YELLOW}📱 Sample login credentials:${NC}"
echo "Username: john_doe"
echo "Password: testpass123"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
