'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function LoginAdmin() {
    const [userForm, setUserForm] = useState({
        email: "",
        password: "",
    })
    const [admin, setAdmin] = useState([])
    const [employee, setEmployee] = useState([])
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const unsubscriveAdmin = onSnapshot(collection(db, "admin"), (snapshot) => {
            const serviceData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAdmin(serviceData);
        });

        const getEmployee = () => {
            fetch(`http://localhost:8080/api/employees`)
                .then(response => response.json())
                .then(data => {
                    setEmployee(data.data[0]);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        return () => {
            getEmployee()
            unsubscriveAdmin()
        };
    }, [])


    const login = async (e) => {
        e.preventDefault();

        try {
            if (admin) {
                const findUser = admin.find((item) => {
                    return item.email === userForm.email;
                });

                if (findUser) {
                    await signInWithEmailAndPassword(auth, userForm.email, userForm.password);
                    router.push("/dashboard");

                    setError("");
                } else {
                    if (!findUser) {
                        setError("Wrong Email!");
                    } else {
                        setError("Wrong password!");
                    }

                }
            } else {
                // handle the case when admin is null
                setError("Admin data is not available!");

            }
        } catch (error) {

            setError(error.message);
            console.error(error);
        }
    };

    const loginEmployee = async (e) => {
        e.preventDefault();
        try {
            if (employee) {
                const findUser = employee.find((item) => {
                    return item.email === userForm.email;
                });

                if (findUser) {
                    await signInWithEmailAndPassword(auth, email, password);
                    router.push("/profile");

                    setError("");
                } else {
                    if (!findUser) {
                        setError("Wrong Email!");
                    } else {
                        setError("Wrong password!");
                    }

                }
            }
        } catch (error) {
            console.warn(error);
        }
    }

    const register = async (e) => {
        e.preventDefault();

        try {
            const newFormState = {
                email: userForm.email,
                password: userForm.password,
                createdAt: new Date().toISOString(),
            };

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                userForm.email,
                userForm.password
            );
            const uid = userCredential.user.uid
            await setDoc(doc(db, "admin", uid), {
                ...newFormState,
                id: uid
            });
        } catch (error) {

            console.error(error);
        }
    };

    const handleChange = (e) => {
        setUserForm({
            ...userForm,
            [e.target.name]: e.target.value,
        });
    }
    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Admin</TabsTrigger>
                <TabsTrigger value="password">Employee</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Enter your admin credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" required id="email" value={userForm.email} onChange={handleChange} name="email" placeholder="a@gmail.com" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" required id="password" value={userForm.password} onChange={handleChange} name="password" placeholder="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={login}>Login</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Enter your employee credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" required id="email" value={userForm.email} onChange={handleChange} name="email" placeholder="a@gmail.com" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" required id="password" value={userForm.password} onChange={handleChange} name="password" placeholder="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={loginEmployee}>Login</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

export default LoginAdmin