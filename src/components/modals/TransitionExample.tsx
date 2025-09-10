import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const TransitionExample = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
            praesentium veniam consequatur quos aspernatur sunt, distinctio
            voluptates fugiat cumque, labore quasi dignissimos ratione ducimus.
            Aliquid consectetur rerum repellat quos deleniti quas totam aliquam
            voluptatem quia, vero ipsam sed aut voluptatum impedit quis.
            Sapiente, pariatur minus. Culpa voluptates illo officia laudantium
            debitis eos iusto assumenda necessitatibus animi esse tenetur quidem
            maiores, omnis hic laborum temporibus nostrum voluptatum quasi
            ratione! Illum beatae delectus rem nulla! Quia molestiae a id earum
            soluta iste cumque ea modi, sed neque eos, quas magni incidunt
            voluptatibus! Vitae deleniti quidem tempore nobis unde quae omnis,
            dolorum assumenda voluptatem deserunt quasi laboriosam molestias
            veniam, asperiores, sequi doloribus mollitia porro adipisci dolor
            velit explicabo dicta nostrum laudantium! Esse, accusantium.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransitionExample;
