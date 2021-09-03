# nodejs_api

## run kub

```
  - docket build -t {yourname}/{tag} .
  - docker login
  - docket push {yourname}/{tag}
  - kompose convert -c
  - cd ./docker-compose/templates
  - kubectl create -f "INSERT ALL FILES"
```