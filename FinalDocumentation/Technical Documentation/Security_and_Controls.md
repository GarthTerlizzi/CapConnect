**Security and Controls**

For security, the CapConnect team implemented some techniques and pieces of software to allow the users to have secure logins and keep their information (and ours) safe from malicious actions. These implementations are detailed below.

**Auth0**:

We used Auth0 as a secure third-party tool to provide secure login and authentication to our users. CapConnect admins have access to the dashboard where they can add and remove users as well as see how many times they have logged in. 

**Strapi**:

Strapi came with some security and control options already, so we used those as much as we could. Admins for CapConnect will have access to all the data in the Strapi/MongoDB database and can remove anything undesirable. Strapi also allows the admins to easily make decisions and changes about what kind of user has what kind of permissions in certain contexts. From the Strapi dashboard, the admins are able to control read/write access to all the different areas of the site, like the tabs, capstones, etc.

**Custom Tabs**:

Tying in to Strapi are the custom tabs we created that are only visible depending on if the user has the correct role or not. Sponsors have different tabs available than a professor would and professors have different tabs than students, for example. This keeps certain user roles from having access to things they should not and provides a level of control as to who can go where on the site.

**Caddy**:

Caddy is another third-party tool we used to give the site HTTPS and certain routing security.
