import sample from "lodash/sample"

if (
  !process.env.NEXT_PUBLIC_NODE_1 ||
  !process.env.NEXT_PUBLIC_NODE_2 ||
  !process.env.NEXT_PUBLIC_NODE_3
) {
  throw Error("One base RPC URL is undefined")
}

// Array of available nodes to connect to
export const nodes = [
  process.env.NEXT_PUBLIC_NODE_1,
  process.env.NEXT_PUBLIC_NODE_2,
  process.env.NEXT_PUBLIC_NODE_3,
]

const getNodeUrl = () => sample(nodes)

export default getNodeUrl
