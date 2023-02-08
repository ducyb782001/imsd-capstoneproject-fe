// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import ImageKit from "imagekit"

type Data = {
  token: string
  expire: number
  signature: string
}

const imageKit = new ImageKit({
  // publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  // privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY,
  // urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  publicKey: "public_XiISXxtv+NpyIofQPuKlcs7wvDQ=",
  privateKey: "private_C/8aaDWi6ivh6H4luz7JsK8nT0Q=",
  urlEndpoint: "https://ik.imagekit.io/imsd",
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const result = imageKit.getAuthenticationParameters()
  res.send(result)
}
