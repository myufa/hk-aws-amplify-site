This is an aws amplify project for displaying a database of volunteers for [HumanKind MI](https://humankindmi.com)

### `Key features`
- Users are created from aws cognito console, user accounts cannot be made by any unauthorized person
- All volunteers and their relevent information is displayed in a list
- Users can add and delete volunteer records
- Volunteer responses to intake google form are automatically pushed to dynamoDB

### `TODO`
- Updating form responses in dynamoDB based on last upload instead of uploading all records in the form
- Deleting records in the google form in parallel with the dynamoDB to avoid failed deletes
- Add automatic matching of volunteers to volunteer organizations based on availability and need