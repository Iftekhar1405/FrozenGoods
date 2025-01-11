ALL ENDPOINTS FROM API:

Auth:
  Register : POST (https://frezzers-faves-api.vercel.app/auth/register)
  LOGIN    : POST (https://frezzers-faves-api.vercel.app/auth/login)
  LOGOUT   : POST (https://frezzers-faves-api.vercel.app/auth/login)

Users:
  GET ALL USERS     : GET (https://frezzers-faves-api.vercel.app/users)
  GET USER BY ID    : GET (https://frezzers-faves-api.vercel.app/users/{id})
  UPDATE USER       : PATCH (https://frezzers-faves-api.vercel.app/users/{id})
  SHOW CURRENT USER : GET (https://frezzers-faves-api.vercel.app/users/me/)

Products:
  CREATE PRODUCT     : POST (https://frezzers-faves-api.vercel.app/products/)
  GET ALL PRODUCTS   : GET (https://frezzers-faves-api.vercel.app/products/)
  GET SINGLE PRODUCT : GET (https://frezzers-faves-api.vercel.app/products/{ID})
  UPDATE PRODUCT     : PATCH (https://frezzers-faves-api.vercel.app/products/6768361f1a170f8bc300a760)

Brands:
  CREATE BRAND   : POST (https://frezzers-faves-api.vercel.app/products/brand/)
  UPDATE BRAND   : PATCH (https://frezzers-faves-api.vercel.app/products/brand/{ID})
  GET ALL BRANDS : GET (https://frezzers-faves-api.vercel.app/products/brand)

Categories:
  CREATE CATEGORY  : POST (https://frezzers-faves-api.vercel.app/products/category)
  GET ALL CATEGORY : GET (https://frezzers-faves-api.vercel.app/products/category)
  UPDATE CATEGORY  :  PATCH (https://frezzers-faves-api.vercel.app/products/category/{ID})

Cart:
  ADD TO CART  : POST (https://frezzers-faves-api.vercel.app/cart/add)
  GET CART     : GET (https://frezzers-faves-api.vercel.app/cart/get)
  REMOVE ITEMS : DELETE (https://frezzers-faves-api.vercel.app/cart/delete/{PRODUCT_ID})
  CLEAR CART   : DELETE (https://frezzers-faves-api.vercel.app/cart/clearAll)
  
  
