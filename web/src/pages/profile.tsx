import NavBar from "@/components/layout/navBar";
import Recipes from "@/components/recipie/recipes";
import { Field } from "@/components/ui/field";
import Network from "@/components/user/network";
import { followUser, unfollowUser } from "@/data/api";
import { useAuth } from "@/hooks/use-auth";
import useMutationUser from "@/hooks/use-mutation-user";
import useQueryRecipes from "@/hooks/use-query-recipes";
import useQueryUser from "@/hooks/use-query-user";
import { Box, Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { KeyboardEvent, useState } from "react";

function TabButton({
  label, value, curtab, callback
}: { 
  label: string; value: string; curtab: string; callback: (v: string) => void
}) {
  return (
    <Button 
      className="w-full" 
      bgGradient="to-l"
      gradientFrom="teal.300"
      gradientTo="blue.400"
      filter={curtab === value ? 'brightness(70%)' : undefined}
      onClick={() => callback(value)}
    >
      {label}
    </Button>
  );
}

const Profile = ({ userId }: {userId: string}) => {
  const { user: loggedInUser } = useAuth();
  const { viewingUser : user, followers, following, loading, refetch } = useQueryUser(userId);
  const isOwnProfile = loggedInUser?.id === user?.id;
  const isFollowing = followers?.some(f => f.id === loggedInUser?.id);


  
  const { updateAvatar } = useMutationUser();
  const { recipes, drafts, likes, bookmarks } = useQueryRecipes();

  const [ tab, setTab ] = useState<string>('recipes'); 
  const [ url, setUrl ] = useState<string>('');

  const handleImageFile = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateAvatar(url);
      setUrl('');
    }
  }

  const handleFollowToggle = async (targetUserId: string, isCurrentlyFollowing: boolean) => {
    if (!targetUserId || !loggedInUser) return;
  
    try {
      if (isCurrentlyFollowing) {
        await unfollowUser(targetUserId, loggedInUser.id);
      } else {
        await followUser(targetUserId, loggedInUser.id);
      }
      await refetch();
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };
  

  if (loading) {
    return (
      <Flex ml="50vw" justify="center" align="center" minH="100vh">
      <Spinner
        color="blue.500"
        size="xl"
      />
    </Flex>
    );
  }

  if (!user) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <h1>User not found.</h1>
      </Flex>
    );
  }

  return (
      <Flex direction="column">
  
        <NavBar />
  
        {/* Sidebar */}
        <Flex bg="white" w="100vw" minH="100vh" mt="4vh" overflowY="auto">
          <Flex direction="row" minH="100vh" overflowY="auto">                
            <Box 
              direction="row"
              minH="100vh"
              h="100vh"
              w="20vw"
              bgGradient="to-l" gradientFrom="green.200" gradientTo="blue.300"
              position="fixed"
              zIndex="100"
            >

         

              <div className="max-h-sm h-auto flex flex-col self-start w-full">
  
                  {/* User info: avatar, email, username, followers, following */}
                  <Flex direction="row" align="center" p="2" mt="2" mr="2">
                    <Flex direction="row" align="center" spaceX="2">
                      <Box p="1">
                          <Image borderRadius="full" src={user.avatarImage ? user.avatarImage : '/anon.jpg'} boxSize="50px"/>
                      </Box>
                      <Flex direction="column">
                          <h2 className="text-white text-xl font-bold">
                              {user.name}
                          </h2>
                          <h1 className="text-white">
                              {user.email}
                          </h1>
                          <Flex direction="row" color="white" gap="2">
                            {followers.length} <Network group={followers} name="Followers"/> {following.length} <Network group={following} name="Following"/>
                          </Flex>
                      </Flex>
                    </Flex>
                  </Flex>

                  <Flex p="4">
                    {!isOwnProfile && (
                      <Button 
                        className="w-full" 
                        bgGradient="to-l"
                        gradientFrom={isFollowing ? "red.300" : "teal.300"}
                        gradientTo={isFollowing ? "red.500" : "blue.400"}
                        onClick={() => handleFollowToggle(user?.id, isFollowing)}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                    )}
                  </Flex>

                  <Flex align='center' p='4' color="white" bg='cyan.400'>
                    Chef Rating: {String(loggedInUser?.id === user.id? loggedInUser.rating : user.rating)}
                  </Flex>
  
                  <div className="max-h-sm h-auto p-4 text-white w-full space-y-2">
                    {loggedInUser?.id === user?.id ? (
                      <>
                        <Field label="Image Url">
                          <Input
                            bg="white"
                            color="black"
                            placeholder="Enter an image url"
                            onKeyDown={(e) => handleImageFile(e)}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                          />
                        </Field>
                        <TabButton label='My Recipes' value='recipes' curtab={tab} callback={setTab} />
                        <TabButton label='My Drafts' value='drafts' curtab={tab} callback={setTab} />
                        <TabButton label='My Likes' value='likes' curtab={tab} callback={setTab} />
                        <TabButton label='My Bookmarks' value='bookmarks' curtab={tab} callback={setTab} />
                      </>
                    ) : (
                      <>
                        <TabButton label='Recipes' value='recipes' curtab={tab} callback={setTab} />
                        <TabButton label='Likes' value='likes' curtab={tab} callback={setTab} />
                      </>
                    )}
  
                  </div>
              </div>
            </Box>
              
            <Flex direction="row" m="3" wrap="wrap" ml="22vw" mt="5vh">
              {tab === 'recipes' && <Recipes recipes={recipes.filter((r) => r.authorId === user.id)} />}
              {tab === 'drafts' && <Recipes recipes={drafts} />}
              {tab === 'likes' && <Recipes recipes={likes} />}
              {tab === 'bookmarks' && <Recipes recipes={bookmarks} />}
            </Flex>
          </Flex>
        </Flex>
  
      </Flex>
  );
}

export default Profile;