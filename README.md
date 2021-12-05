# Database encryption using AES256

Encrypting data using AES256 in a mongoDB database and retrieving it in encrypted as well as decrypted format.

## How to run 

Clone this repo, then run the following commands:

```bash 
mongod
```
```bash
node server.js
```
After getting the message ```Server running on port 3000.``` in the terminal, go to ```localhost:3000``` in your browser for entering the data in the database.

## Usage

Entering data: Go to ```localhost:3000```

Reading data (both encrypted and decrypted): Go to ```localhost:3000/read_data```

Updating data: Go to ```localhost:3000/update_details```

Deleting data: Go to ```localhost:3000/delete_details```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Made with ❤️ by Ashish Tiwari  

## License
[MIT](https://choosealicense.com/licenses/mit/)