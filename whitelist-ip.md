# MongoDB Atlas IP Whitelist Guide

When you encounter the error:

```
MongoDB Connection Error: MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

Follow these steps to whitelist your IP:

## Quick Steps

1. **Log in to MongoDB Atlas** at [cloud.mongodb.com](https://cloud.mongodb.com)

2. **Select your project/cluster**

3. **Click on "Network Access" in the left sidebar**

4. **Click "Add IP Address"**

5. **Add Your Current IP**
   - Click "Add Current IP Address" button
   - Or manually enter your IP address
   - Add a description like "My Development Machine"

6. **Click "Confirm"**

7. **Wait for the changes to apply** (usually takes less than a minute)

8. **Restart your server application**

## Check Your Connection String

Make sure your MongoDB connection string is correct:

- Format: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
- Replace `<username>`, `<password>`, `<cluster>`, and `<database>` with your actual values
- Check that you don't have any typos in the username or password
- Verify that you're connecting to the right cluster and database

## Allow Access from Anywhere (Development Only)

For development purposes, you can allow access from anywhere:

1. Click "Add IP Address"
2. Enter `0.0.0.0/0` in the IP Address field
3. Add a description like "Allow Access from Anywhere"
4. Click "Confirm"

**Note**: This is not recommended for production environments!

## For Production Deployments

For services like Render:

1. Check Render documentation for their IP ranges
2. Add those IP ranges to MongoDB Atlas Network Access
