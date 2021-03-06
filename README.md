
<p align="center">
  <img src="https://experts-event-notification.herokuapp.com/images/experts-logo.png" width="150" title="Marketing Cloud Experts">
</p>

# Content Builder SDK - Calendar Creator Block

<p align="center">
  <img src="https://experts-cbsdk-calendarcreator.herokuapp.com/images/cb-sdk-calendar-creator.png" width="100%" title="Marketing Cloud Experts">
</p>

## Overview

* This SDK app provides a way take input from the block, create a calendar (ICS) file, upload that file to Content Builder, and ultimately create a button that the user can add to their calendar.
* The app actually creates two buttons. One with a link to the ICS file and one with a link to add to a google calendar stacked on top of each other. The google button has a style of display: none. To leverage this to render properly add this bit of code to the template style.

```
u ~ div .gmail-hide {
display:none;
}
u ~ div .gmail-show {
display:block!important;
}
```

## Install In Your Environment
* Must have a working Heroku Account to host app
* Select the Deploy to Heroku button below
* Fill out the environment variables
	* CLIENTID - Client Secret of API Package (Not Legacy Package)
	* CLIENTSECRET - Client Secret of API Package (Not Legacy Package)
	* SUBDOMAIN - Tenant Specific Subdomain. Ex.mcmtwjynv76zg4b73149z7yzw5mm
	* ICSFOLDERID - Content Builder Folder ID Where ICS Files Will Reside
  * MID - MID of Business Unit you are deploying the block in
* Create an Installed Package and add a component type of Custom Content Block. Use the Heroku app URL as the Endpoint URL when configuring this component.

<a href="https://www.heroku.com/deploy/?template=https://github.com/acates1982/cbSdkCalendarCreator">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>
