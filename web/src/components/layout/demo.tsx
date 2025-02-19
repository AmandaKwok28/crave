import { Heading, Highlight } from "@chakra-ui/react"

const Demo = () => {
  return (
    <div> 
      <Heading size= "4xl">
        <Highlight
          query={["World"]}
          styles={{ px: "0.5", color: "orange" }}
        >
          Hello World!
        </Highlight>
      </Heading>
    </div>

  )
}

export default Demo;