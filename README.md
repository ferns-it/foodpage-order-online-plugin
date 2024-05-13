# Foodpage Order Online Plugin

## Online Order Page

This project simplifies the integration of an online order page into existing projects.

## Introduction

This project aims to streamline the process of integrating an online order page into your application. By following the steps outlined below, you'll be able to seamlessly incorporate this functionality into your project.

# Environment Variable

     REACT_APP_API_BASE_URL="https://foodpage.co.uk/development/"

## Checkout to current branch.

## Third-party packages are used. Run this command before initializing:

    npm install react-icons axios react-hot-toast

## Bootstrap CDN was used here, if not used in your client side please paste it. [use the latest one]

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
      integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
      crossorigin="anonymous"

## Wrap the App tag with OrderOnlineContextProvider

    <AppContextProvider> 
    <OrderOnlineContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </OrderOnlineContextProvider>
    </AppContextProvider>

## main

    - OrderOnlinePage.jsx
        -> OrderOnlineApp.css [For style]

# Feel free to customize this README further with additional information about your project.

🌿 Ferns IT 🌿
