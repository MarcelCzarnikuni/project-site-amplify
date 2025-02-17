import { useState } from "react";
import { View, Flex, Button, useAuthenticator } from "@aws-amplify/ui-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut, user } = useAuthenticator((context) => [context.user]);

    return (
        <View as="nav" className="navbar" padding="1rem" backgroundColor="black" color="white" width="100%">
            <Flex justifyContent="space-between" alignItems="center">
                <View fontSize="1.5rem" fontWeight="bold">
                    Project App
                </View>

                <Flex gap="1rem">
                    {user ? (
                        <Button onClick={signOut} variation="primary">Sign Out</Button>
                    ) : (
                        <Button variation="primary">Sign In</Button>
                    )}
                </Flex>
            </Flex>
        </View>
    );
};

export default Navbar;
