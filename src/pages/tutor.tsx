import { Card, Heading, Skeleton } from "@chakra-ui/react"

const TutorPage: React.FC = () => {
    return (
        <div>
            <h1>Tutor Page</h1>
            <p>Welcome to the Tutor page!</p>

            <Skeleton asChild loading={false} >
                <Card.Root size="sm">
                    <Card.Header>
                        <Heading size="md"> Card - sm</Heading>
                    </Card.Header>
                    <Card.Body color="fg.muted">
                        This is the card body. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit.
                    </Card.Body>
                </Card.Root>
            </Skeleton>
            
        </div>
    );
};

export default TutorPage;