from pymongo import MongoClient
import sys

uri = "mongodb+srv://savartisanflow_db_user:airwave1@artisanflow-cluster.zriohgn.mongodb.net/artisanflow?retryWrites=true&w=majority&appName=ArtisanFlow-Cluste"

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # The ismaster command is cheap and does not require auth.
    # To check auth we need to perform an operation.
    db = client.get_database("artisanflow")
    print("Databases:", client.list_database_names())
    print("Collections:", db.list_collection_names())
    print("SUCCESS: Connection and Auth successful.")
except Exception as e:
    print(f"FAILURE: {e}")
