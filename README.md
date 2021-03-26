# ***Increa CRM***

> **Open Source CRM Solution**

## *Installation*

Increa CRM developed using `Express JS, PUG html template engine & MongoDB as database`. This application is deployed in `Heroku`. Here is the [Github Link](https://github.com/unnikottamam/increa-crm.git) for the project files. To install CRM locally in your computer, follow the steps;

Before the installation process;
- You should have the latest npm version installed on your computer.
- You should have the basic DB set up in MongoDB and you should know how to handle MongoDB and heroku environments.

After the above pre-request, follow the steps;

1. `git pull https://github.com/unnikottamam/increa-crm.git`
2. `npm install` : this will install the necessary packages needed for this project
3. `cd increa-crm` : You can change this folder name.
4. `npm run server`
5. Done !

There will be an error if you run the server.
To fix this error, create file named `keys_dev.js` in the config file with the following content;
```javascript
module.exports = {
    mongoURI:
        "mongodb+srv://<your-mongodb-url-string>",
    secretOrKey: "your-secret-key-goes-here"
};
```

For security reasons, do not push this file into the repository. To deploy the app, use the production environment variables (You can set up those values in Heroku app settings).

***

## *Overview*

> Increa CRM is an open source CRM solution for the small scale business sector. Core modules included in this CRM are;

### *1. Leads Module*

Leads can be generated by using a web form or an employee / admin can add leads manually in the dashboard. `Web Form`, which is provided along with this CRM solution can be used as an iframe and easy to plug and play within your website. But if you need to create a custom form for your website, Increa CRM provides an API endpoint, where you can submit the form action, and generate the JSON output from the server.

#### *Core Features of the Leads module are;*
- Using a web form, leads will generate and list in the dashboard. Here is the iframe wolution provided by the CRM: `<iframe src="<your-app-url>/web-form.html" height="200" width="300" title="Web Form"></iframe>`
- Filter and Sort the lead list
- Leads can be edited manually in the dashboard, For internal purpose, details of the edit log is added to the database such as; date, edited by, role of the edited person.
- Detailed lead view
- Deletion option for every lead
- Client generation from each leads on a single button click

### *2. Client Module*

Client details can be entered manually or it can be automatically generated from each leads. Increa CRM limited to client name, email, address, phone and internal log details such as edited by, edited user details and date.

#### *Core Features of the Client module are;*
- You can add a client manually or this will automatically generate from leads (Use the create client button)
- Each client details can be edited in the dashboard (Added Security: Only admins can edit client details)
- A detailed view for the client

### *3. User Module*

Users are created in the registration page and it will be visible to the admins in the dashboard. There is a user list page in the CRM and admins can change the user role.

### *3. Settings*

CRM users can change their password in the settings page.