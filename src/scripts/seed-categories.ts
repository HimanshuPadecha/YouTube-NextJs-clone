//TODO : make a seed file to add records to database

import { db } from "@/db";
import { categories } from "@/db/schema";

const catagoriesName = [
    "Cars and vehicals",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film and animations",
    "How-to and style",
    "Music",
    "News and politics",
    "People and blogs",
    "Pets and animals",
    "Science and technology",
    "Sports",
    "Travel and Events"
]

async function main(){

    try {
        const values =catagoriesName.map(catagory=> {
            return {
                name:catagory,
                description:`Videos related to ${catagory}`
            }
        })

        await db.insert(categories).values(values)
        
        console.log("the values added successfully");
        
    } catch (error) {
        console.error("Error while seeding catagories",error)
        process.exit(1)
    }
}

main()