FROM python:3.10.12 

WORKDIR /app

COPY requirements.txt ./
RUN pip3 install --upgrade pip -r requirements.txt
COPY . .
EXPOSE 8000