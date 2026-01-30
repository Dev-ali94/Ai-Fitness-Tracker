import { dummyUser, dummyFoodLogs, dummyActivityLogs } from "./assets";



const getDB = () => {
    const dbStr = localStorage.getItem('fitness_db');
    if (!dbStr) {
        const initialDB = {
            user: null,
            foodLogs: [],
            activityLogs: [],
        };
        return initialDB;
    }
    return JSON.parse(dbStr);
};

const saveDB = (db) => {
    localStorage.setItem('fitness_db', JSON.stringify(db));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockApi = {
    auth: {
        login: async (credentials) => {
            await delay(500);
            let db = getDB();

            if (!db.user) {
                db.user = {
                    ...dummyUser,
                    email: credentials.identifier || credentials.email,
                    username: (credentials.identifier || credentials.email).split('@')[0],
                };
                db.foodLogs = [...dummyFoodLogs];
                db.activityLogs = [...dummyActivityLogs];
                saveDB(db);
            }
            return {
                data: {
                    user: db.user,
                    jwt: "mock_jwt_token_" + Date.now(),
                },
            };
        },
        register: async (credentials) => {
            await delay(500);
            const db = getDB();

            db.user = {
                id: "user_" + Date.now(),
                username: credentials.username,
                email: credentials.email,
                age: 0,
                weight: 0,
                height: 0,
                goal: "maintain",
                dailyCalorieIntake: 2000,
                dailyCalorieBurn: 400,
                createdAt: new Date().toString(),
            };
            db.foodLogs = [];
            db.activityLogs = [];
            saveDB(db);

            return {
                data: {
                    user: db.user,
                    jwt: "mock_jwt_token_" + Date.now(),
                },
            };
        }
    },
    user: {
        me: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.user || dummyUser };
        },
        update: async (_id, updates) => {
            await delay(300);
            const db = getDB();
            if (db.user) {
                db.user = { ...db.user, ...updates };
                saveDB(db);
            }
            return { data: db.user };
        }
    },
    foodLogs: {
        list: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.foodLogs };
        },
        create: async ({ data }) => {
            await delay(300);
            const db = getDB();
            const newEntry = {
                id: Date.now(),
                documentId: "doc_food_" + Date.now(),
                name: data.name,
                calories: data.calories,
                mealType: data.mealType,
                date: new Date().toString().split("T")[0],
                createdAt: new Date().toString(),
            };
            db.foodLogs.push(newEntry);
            saveDB(db);
            return { data: newEntry };
        },
        delete: async (documentId) => {
            await delay(300);
            const db = getDB();
            db.foodLogs = db.foodLogs.filter(f => f.documentId !== documentId);
            saveDB(db);
            return { data: { id: documentId } };
        }
    },
    activityLogs: {
        list: async () => {
            await delay(300);
            const db = getDB();
            return { data: db.activityLogs };
        },
        create: async ({ data }) => {
            await delay(300);
            const db = getDB();
            const newEntry = {
                id: Date.now(),
                documentId: "doc_act_" + Date.now(),
                name: data.name,
                duration: data.duration,
                calories: data.calories,
                date: new Date().toString().split("T")[0],
                createdAt: new Date().toString(),
            };
            db.activityLogs.push(newEntry);
            saveDB(db);
            return { data: newEntry };
        },
        delete: async (documentId) => {
            await delay(300);
            const db = getDB();
            db.activityLogs = db.activityLogs.filter(a => a.documentId !== documentId);
            saveDB(db);
            return { data: { id: documentId } };
        }
    },
    imageAnalysis: {
        analyze: async (_formData) => {
            await delay(1500);
            const foods = [
                { name: "Apple", calories: 95 },
                { name: "Banana", calories: 105 },
                { name: "Avocado Toast", calories: 250 },
                { name: "Pizza Slice", calories: 300 },
            ];
            const randomFood = foods[Math.floor(Math.random() * foods.length)];
            return {
                data: {
                    result: randomFood
                }
            };
        }
    }
};

export default mockApi;
