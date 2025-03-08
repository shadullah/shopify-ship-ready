// data/emailTemplates.js
export const templatePlans = {
  basic: {
    welcome: {
      subject: "Welcome to [Store Name]! Start Your Journey with Us 🎉",
      body: `Hi [Customer Name],\nWelcome to [Store Name]! We’re thrilled to have you join our community of savvy shoppers and store owners. ✅\n\nHere’s how to get started:\n• Explore our best-selling products and add them to your cart. 🛒\n• Enjoy [X%] off your first order with code WELCOME. 💸\n• Stay tuned for exclusive updates, VIP offers, and expert tips. 📬\n\nNeed help? Our customer support team is here to ensure your experience is smooth. 🙌\n\nEnjoy the ride!\n\nBest regards,\n[Your Store Name] Team`,
    },
    abandoned_cart: {
      subject: "Oops! You Left Something Behind – Complete Your Order 🛒",
      body: `Hi [Customer Name],\nIt looks like you were just about to grab some amazing items from our store, but your cart is still waiting! ✅\n\nYour Cart:\n[Product Image]\n[Product Name] – [Price]\n\nWe've saved your cart, and you can check out anytime with a special discount. 💸\nComplete your purchase now with code SAVE. ⏳\n\n[Link to Cart]\n\nIf you have any questions, reach out—we’re here to help! 🙌\n\nBest regards,\n[Your Store Name] Team`,
    },
    purchase_confirmation: {
      subject: "Thank You for Your Order! Preparing It Now 📦",
      body: `Hi [Customer Name],\nThank you for your purchase from [Store Name]! We’re excited to get your order ready and deliver it to your doorstep. 🚚\n\nOrder Summary:\n[Product Name] – [Price]\n[Product Name] – [Price]\n\nEstimated Delivery Date: [Date]\nOrder Number: [Order ID]\n\nTrack your order here: [Link to Tracking]\n\nThank you for choosing us—we hope you love it! 💖\n\nBest regards,\n[Your Store Name] Team`,
    },
    product_recommendation: {
      subject: "Check Out These Recommendations! 🌟",
      body: `Hi [Customer Name],\nBased on your recent purchase of [Product Name], we’ve handpicked some items we think you’ll love. ✅\n\nYou Might Also Like:\n[Product Name] – [Price]\n[Product Name] – [Price]\n\nUse code THANKYOU for [X%] off your next order. 💸\n\n[Link to Products]\n\nWe hope you enjoy these!\n\nBest regards,\n[Your Store Name] Team`,
    },
    re_engagement: {
      subject: "We Miss You! Special Offer Inside 🎉",
      body: `Hi [Customer Name],\nIt’s been a while since we saw you at [Store Name]. We’d love to welcome you back with a special offer! ✅\n[X%] off your next purchase with code WELCOMEBACK. 💸\nCheck out our latest collection: [Link to Store]\n\nCan’t wait to see you again! 🙌\nBest regards,\n[Your Store Name] Team`,
    },
    flash_sale: {
      subject: "Flash Sale! Save Big, 24 Hours Only ⏰",
      body: `Hi [Customer Name],\nOur 24-Hour Flash Sale is live—save up to [X%] on everything in our store! 🎉\nHurry, this offer ends in 24 hours. ⏳\nShop now: [Link to Store]\n\nGrab your favorites before they’re gone! 🛍️\nBest regards,\n[Your Store Name] Team`,
    },
    back_in_stock: {
      subject: "[Product Name] Is Back in Stock! 🌟",
      body: `Hi [Customer Name],\nGreat news—the product you’ve been waiting for, [Product Name], is back in stock! ✅\n\n[Product Image]\nPrice: [Price]\n\nDon’t wait—order now before it sells out: [Link to Product]\n\nExcited to have you shop with us! 🙌\nBest regards,\n[Your Store Name] Team`,
    },
    order_status: {
      subject: "Your Order Is On Its Way! 🚚",
      body: `Hi [Customer Name],\nYour order [Order ID] has shipped and is on its way to you! 📦\n\nOrder Details:\n[Product Name] – [Price]\n[Product Name] – [Price]\nTrack it here: [Tracking Link]\n\nThank you for choosing us—hope you love it! 💖\n\nBest regards,\n[Your Store Name] Team`,
    },
    bundle_offer: {
      subject: "Bundle & Save – [X%] Off Now! 🎉",
      body: `Hi [First Name],\nWhy settle for one? Bundle [Product 1] with [Product 2] and save [X%] on your order! ✅\nIt’s the perfect way to get more while saving big. 💸\n\nBundle Now and Save\nHurry, offer ends soon! ⏳\nBest regards,\n[Your Store Name]`,
    },
    vip_early_access: {
      subject: "VIP Early Access to Our New Collection! ✨",
      body: `Hi [First Name],\nAs a VIP customer, enjoy exclusive early access to our latest collection! ✅\nShop new arrivals with special offers just for you. 💸\n\nShop Early Access Now\nGet the hottest items before they sell out! ⏰\nBest regards,\n[Your Store Name]`,
    },
    post_purchase_upsell: {
      subject: "Enhance Your [Product Name] with This! 🌟",
      body: `Hi [First Name],\nWe hope you’re loving your new [Product Name]! Check out these items to complete your look: ✅\n[Related Product 1] – [Short Description]\n[Related Product 2] – [Short Description]\n\nShop now for [X%] off your next purchase! 💸\nShop More\nBest regards,\n[Your Store Name]`,
    },
    customer_feedback: {
      subject: "Share Your Thoughts on [Product Name]! 📝",
      body: `Hi [First Name],\nWe’d love your feedback on [Product Name] to help us improve! ✅\nIt takes just a minute and supports other shoppers. 🙌\n\nLeave a Review Here\nAs a thank you, enjoy [X%] off your next purchase! 💸\nBest regards,\n[Your Store Name]`,
    },
  },
  pro: {
    abandoned_cart_reminder_1: {
      subject: "Don’t Miss [Product Name] – Complete Now! 🛒",
      body: `Hi [First Name],\nYou were checking out [Product Name] but didn’t complete your purchase. We’ve saved it for you! ✅\n\n[Product Name] is in your cart.\nGet [X%] off with code SAVE. 💸\nHurry, offer expires in 24 hours! ⏰\n\n[Complete Your Purchase Now]\nNeed help? We’re here! 🙌\nBest regards,\n[Your Store Name]`,
    },
    abandoned_cart_reminder_2: {
      subject: "Still Thinking About [Product]? Save Now! 🛒",
      body: `Hey [First Name],\nYou left [Product Name] in your cart! We’ve saved it for you. ✅\n\nEnjoy [X%] off to complete your order. 💸\nThis offer expires in 24 hours! ⏳\n\n[Grab Your Deal Now]\nQuestions? We’re here to assist! 🙌\n[Your Store Name]`,
    },
    related_product_recommendation_1: {
      subject: "Loved [Previous Product]? Check These Out! 🌟",
      body: `Hi [First Name],\nSince you loved [Previous Product], try these amazing related products: ✅\n[Product 1] – [Short Description]\n[Product 2] – [Short Description]\n\nGet [X%] off your next purchase! 💸\n[Shop Now and Get [X%] Off]\nBest regards,\n[Your Store Name]`,
    },
    related_product_recommendation_2: {
      subject: "More for You After [Previous Product]! ✨",
      body: `Hey [First Name],\nYou picked a winner with [Previous Product]—check out these too: ✅\n[Product 1] – [Short Description]\n[Product 2] – [Short Description]\n\nEnjoy [X%] off your next order! 💸\n[Shop Now & Save [X%]]\nSee you soon,\n[Your Store Name]`,
    },
    purchase_confirmation_1: {
      subject: "Thank You! Your [Product Name] Is Coming 📦",
      body: `Hi [First Name],\nThank you for buying [Product Name] from us! We appreciate it. ✅\n\nNext Steps:\nShipping in [X] days. 🚚\nTracking sent when shipped. 📬\nSupport available if needed. 🙌\n\nCan’t wait to serve you again! 💖\n[Track Your Order Here]\nBest regards,\n[Your Store Name]`,
    },
    purchase_confirmation_2: {
      subject: "Order Confirmed for [Product Name]! ✅",
      body: `Hi [First Name],\nYour order for [Product Name] is confirmed! 🎉\n\nExpect:\nShipping in [X] days. 🚚\nTracking when shipped. 📬\nQuestions? Our team is here. 🙌\n\nExcited for you to receive it! 💖\n[Track Your Order]\nBest,\n[Your Store Name]`,
    },
    cross_sell_offer_1: {
      subject: "More for Less with [Product Name]! 🌟",
      body: `Hi [First Name],\nYou recently bought [Product Name]—pair it with [Related Product] for [X%] off! ✅\nIt’s a perfect match, but only for a limited time. 💸\n\n[Get Your Exclusive Offer Now]\nBest regards,\n[Your Store Name]`,
    },
    cross_sell_offer_2: {
      subject: "Perfect Pair for [Product Name]! ✨",
      body: `Hi [First Name],\nSince you got [Product Name], add [Related Product] for [X%] off! ✅\nWhy You’ll Love This:\n[Product Name] + [Related Product] = Great combo 💖\nLimited time only! ⏳\n\n[Claim Your [X%] Off Now]\nGet it before it’s gone! 🏃‍♀️\nBest,\n[Your Store Name]`,
    },
  },
  premium: {
    re_engagement_1: {
      subject: "We Miss You, [First Name]! Special Gift 🎉",
      body: `Hi [First Name],\nIt’s been a while—we miss you at [Store Name]! ✅\nAs a thank you, enjoy [X%] off your next order with code VIPGIFT. 💸\nOffer expires in 48 hours! ⏰\n\n[Claim Your Gift Now]\nBest regards,\n[Your Store Name]`,
    },
    re_engagement_2: {
      subject: "Welcome Back, [First Name]! Offer Inside 🎉",
      body: `Hey [First Name],\nWe’ve missed you! Get [X%] off your next order with code VIPGIFT. ✅\nValid for 48 hours only! ⏳\n\n[Claim Your Exclusive Discount Now]\nCan’t wait to see you! 💖\nBest,\n[Your Store Name]`,
    },
    flash_sale_1: {
      subject: "Flash Sale – [X%] Off, 24 Hours Only! ⏰",
      body: `Hi [First Name],\nOur 24-Hour Flash Sale is on—save up to [X%] on everything! 🎉\nShop now before it ends: [Link to Store]\n\nHurry, time’s running out! ⏳\nBest regards,\n[Your Store Name]`,
    },
    flash_sale_2: {
      subject: "24 Hours Only – [X%] Off Everything! 🔥",
      body: `Hey [First Name],\nEverything’s on sale for 24 hours—save [X%] storewide! ✅\nDon’t miss out, offer ends soon! ⏰\n\n[Shop the Flash Sale Now]\nGrab your favorites! 🛍️\nBest,\n[Your Store Name]`,
    },
    customer_feedback_1: {
      subject: "Your Feedback on [Product Name]! 📝",
      body: `Hi [First Name],\nWe hope you’re enjoying [Product Name]! Share your thoughts to help us improve. ✅\nTakes a minute—leave a review here: [Leave a Review Here]\nGet [X%] off your next purchase as a thank you! 💸\nBest regards,\n[Your Store Name]`,
    },
    customer_feedback_2: {
      subject: "Tell Us About [Product Name]! 📝",
      body: `Hi [First Name],\nLoving your [Product Name]? Your feedback helps us and other shoppers. ✅\nLeave a review for [X%] off your next order! 💸\n\n[Leave a Review]\nThanks for your support! 🙌\nBest,\n[Your Store Name]`,
    },
    seasonal_sale_1: {
      subject: "Get [Season] Sale Deals – Up to [X%] Off! 🎉",
      body: `Hi [First Name],\nThe [Season] Sale is here—save up to [X%] on everything! ✅\nTop Picks:\n[Product 1] – [Short Description]\n[Product 2] – [Short Description]\n\nShop now, sale ends soon! ⏳\n[Shop the [Season] Sale Now]\nBest regards,\n[Your Store Name]`,
    },
    seasonal_sale_2: {
      subject: "Shop the [Season] Sale – Up to [X%] Off! 🔥",
      body: `Hi [First Name],\nOur [Season] Sale is live—get up to [X%] off storewide! ✅\nTop Picks:\n[Product 1] – [Short Description]\n[Product 2] – [Short Description]\n\nDon’t miss out, ends soon! ⏰\n[Shop the [Season] Sale Now]\nHappy shopping! 🛍️\nBest,\n[Your Store Name]`,
    },
    vip_sale_1: {
      subject: "VIP Sale Access – Exclusive Deals! ✨",
      body: `Hi [First Name],\nAs a VIP, get exclusive access to our VIP Sale! ✅\nEnjoy:\nEarly access to new arrivals 🌟\nUp to [X%] off 💸\nVIP-only items 💎\n\nClaim now before it starts! ⏳\n[Claim Your VIP Access Here]\nBest regards,\n[Your Store Name]`,
    },
    vip_sale_2: {
      subject: "VIP Sale Starts Soon – Your Exclusive Access! 🌟",
      body: `Hi [First Name],\nYou’re invited to our VIP Sale—exclusive for valued customers! ✅\nGet:\nEarly access to arrivals ✨\nUp to [X%] off 💸\nVIP-only products 💎\n\nDon’t miss out! ⏳\n[Claim Your VIP Access Now]\nExcited to treat you! 💖\nBest,\n[Your Store Name]`,
    },
    anniversary_offer_1: {
      subject: "Happy [X] Year Anniversary! 🎉",
      body: `Hi [First Name],\nWe’re celebrating our [X] year anniversary—thank you for being a loyal customer! ✅\nYour gift:\n[X%] off your next purchase 💸\nFree shipping this week 🚚\n\n[Claim Your Anniversary Gift]\nGrateful for you! 🙌\nBest regards,\n[Your Store Name]`,
    },
    anniversary_offer_2: {
      subject: "Cheers to [X] Years! Your Gift Awaits 🎉",
      body: `Hi [First Name],\nOur [X] year anniversary is here—thanks to you! ✅\nEnjoy:\n[X%] off your next purchase 💸\nFree shipping this week 🚚\n\n[Claim Your Anniversary Gift Now]\nSo grateful for your support! 💖\nBest,\n[Your Store Name]`,
    },
    new_product_launch_1: {
      subject: "Introducing [Product Name]! ✨",
      body: `Hi [First Name],\nExcited to launch our newest product: [Product Name]! ✅\nWhy it’s a must-have:\n[Feature 1]\n[Feature 2]\n[Feature 3]\nGet [X%] off your first order! 💸\n\n[Shop Now Before It Sells Out]\nBest regards,\n[Your Store Name]`,
    },
    new_product_launch_2: {
      subject: "Meet [Product Name] – New Arrival! 🌟",
      body: `Hi [First Name],\nThrilled to introduce [Product Name]! ✅\nWhat makes it special:\n[Feature 1]\n[Feature 2]\n[Feature 3]\nSave [X%] on your first order! 💸\n\n[Shop Now Before It’s Gone]\nLimited time only! ⏳\nBest,\n[Your Store Name]`,
    },
    birthday_offer_1: {
      subject: "Happy Birthday, [First Name]! 🎉",
      body: `Hi [First Name],\nIt’s your special day—let’s celebrate! ✅\nYour gift:\n[X%] off your next purchase 💸\nFree shipping on any order 🚚\n\n[Claim Your Birthday Gift Here]\nWishing you a great day! 💖\nBest regards,\n[Your Store Name]`,
    },
    birthday_offer_2: {
      subject: "Happy Birthday, [First Name]! Gift Inside 🎉",
      body: `Hey [First Name],\nIt’s your day—here’s a treat for you! ✅\nEnjoy:\n[X%] off your next purchase 💸\nFree shipping on any order 🚚\n\n[Claim Your Gift Here]\nHave an amazing birthday! 💖\nCheers,\n[Your Store Name]`,
    },
  },
};