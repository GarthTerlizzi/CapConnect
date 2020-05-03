**Authentication and Authorization**

To aid in the security and authentication process of CapConnect, we have implemented some useful tools, like Auth0 and Caddy.

**Auth0**:
	
We installed Auth0’s Single-Page Application module to allow for simple registration and security. The new module gave us the following features and abilities:
-	Registering as a new user
-	Logging out of the site to prompt sign-in when you return
-	Token access (specifically an auth0 prop to give the application the user’s name, email, and if they have been authenticated or not)
-	A user dashboard to monitor security, user creation, and user login
To gain access to the dashboard, all an admin would need to do is be added to the board by an existing admin and then they will have access to the user information like the username, email, and number of logins. The admins can add users manually, delete users, and set permissions from this capconnect.auth0.com dashboard.

**Caddy**:

Caddy is a service we installed to route the Strapi traffic through and added HTTPS to the site.
