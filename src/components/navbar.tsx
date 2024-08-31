import {
  Box,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Link,
  HStack,
  VStack,
  Text,
  ChakraProps,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { map } from "lodash";
import logo from "@/../public/logo.svg";
import PrimaryButton from "./primary-button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { FaPen } from "react-icons/fa";

// Types
import { NavbarProps, NavLink } from "@/types/types";

// Hooks
import usePendingUpdates from "@/hooks/usePendingUpdates";

const NavLinks = ({ navLinks }: { navLinks: NavLink[] }) => {
  return map(navLinks, (link) => (
    <Link
      key={link.name}
      px={6}
      py={2}
      w="full"
      _hover={{ textDecoration: "none", bg: "gray.700" }}
    >
      {link.name}
    </Link>
  ));
};

const Logo = () => {
  return (
    <HStack as={Link} href="/" _hover={{ textDecor: "none" }}>
      <Image src={logo} alt="dotcodeschool" height={32} />
      <Text fontFamily="monospace" fontSize="lg" fontWeight="semibold">
        dotcodeschool
      </Text>
    </HStack>
  );
};

const StartCourseButton = ({ ...props }: ChakraProps) => {
  return (
    <PrimaryButton
      as={Link}
      href="/courses"
      _hover={{ textDecor: "none" }}
      {...props}
    >
      Courses
    </PrimaryButton>
  );
};

type UserDetailProps = {
  name?: string;
  image?: string;
  email?: string;
};

const UserDetails = ({ name, image, email }: UserDetailProps) => {
  return (
    <HStack
      px={{ base: 0, md: 4 }}
      pt={{ base: 0, md: 2 }}
      pb={{ base: 0, md: 4 }}
    >
      <Avatar name={name} src={image} />
      <VStack spacing={0} align="start">
        <Text fontWeight="semibold">{name}</Text>
        <Text fontSize="sm" fontWeight="normal" color="gray.400">
          {email}
        </Text>
      </VStack>
    </HStack>
  );
};

const Auth = () => {
  const { data: session } = useSession();
  return session ? (
    <Fragment>
      <VStack
        display={{ base: "flex", md: "none" }}
        spacing={4}
        w="full"
        align="start"
      >
        <UserDetails
          name={session.user?.name || undefined}
          image={session.user?.image || undefined}
          email={session.user?.email || undefined}
        />
        <Button
          onClick={() => signOut()}
          variant="outline"
          w={{ base: "full", md: "fit-content" }}
        >
          Logout
        </Button>
      </VStack>
      <Box display={{ base: "none", md: "block" }}>
        <Menu>
          <MenuButton as={Button} variant="unstyled">
            <HStack>
              <Avatar
                name={session.user?.name || undefined}
                src={session.user?.image || undefined}
                size="sm"
              />
            </HStack>
          </MenuButton>
          <MenuList>
            <UserDetails
              name={session.user?.name || undefined}
              image={session.user?.image || undefined}
              email={session.user?.email || undefined}
            />
            <hr />
            <MenuItem onClick={() => signOut()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Fragment>
  ) : (
    <PrimaryButton
      onClick={() => signIn()}
      px={8}
      w={{ base: "full", md: "fit-content" }}
    >
      Login
    </PrimaryButton>
  );
};

const DrawerMenu = ({
  navLinks,
  cta,
  isOpen,
  onClose,
}: {
  navLinks: NavLink[];
  cta: boolean;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="gray.800" color="white">
        <DrawerCloseButton />
        <DrawerHeader>
          <Logo />
        </DrawerHeader>
        <DrawerBody px={0}>
          <VStack align="start" spacing={0}>
            {navLinks && <NavLinks navLinks={navLinks} />}
            <VStack p={6} w="full">
              {cta ? <StartCourseButton w="full" /> : <Auth />}
            </VStack>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const Navbar = ({
  navLinks = [],
  cta = true,
  isLessonInterface,
  lessonDetails,
}: NavbarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session, status } = useSession();

  if (!lessonDetails) {
    lessonDetails = {
      courseId: "",
      lessonId: "",
      chapterId: "",
      chapters: [],
      githubUrl: "",
    };
  }

  const { lessonId, chapterId, chapters, githubUrl } = lessonDetails;
  const currentChapter = chapters[Number(chapterId) - 1]?.title;

  usePendingUpdates();

  return (
    <Flex
      position={isLessonInterface ? "sticky" : "static"}
      top={0}
      zIndex={10}
      align="center"
      justify="space-between"
      py={2}
      px={[6, 12]}
      bg={isLessonInterface ? "gray.900" : "gray.800"}
      borderBottom={isLessonInterface ? "1px solid" : "none"}
      borderBottomColor="gray.700"
      color="white"
    >
      <Logo />
      <Spacer />
      <HStack display={{ base: "none", md: "flex" }} spacing={4}>
        {navLinks && !isLessonInterface && <NavLinks navLinks={navLinks} />}
        {isLessonInterface && (
          <Button
            as={Link}
            leftIcon={<FaPen />}
            variant="outline"
            href={`${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=Dot+Code+School+Suggestion:+Feedback+for+Section+${lessonId}+-+Chapter+${chapterId}:+${currentChapter}`}
            w="full"
            _hover={{
              textDecoration: "none",
            }}
            isExternal
          >
            Submit Feedback
          </Button>
        )}
        {cta ? <StartCourseButton /> : <Auth />}
      </HStack>
      <IconButton
        aria-label="Toggle navigation"
        icon={<HamburgerIcon />}
        display={{ base: "block", md: "none" }}
        onClick={isOpen ? onClose : onOpen}
        bg="transparent"
        color="white"
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      />
      <DrawerMenu
        isOpen={isOpen}
        onClose={onClose}
        navLinks={navLinks}
        cta={cta}
      />
    </Flex>
  );
};

export default Navbar;
