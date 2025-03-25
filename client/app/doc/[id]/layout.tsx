import { auth } from "@clerk/nextjs/server"
import { useParams } from "next/navigation";

const DocLayout = ({children}:{children:React.ReactNode}) => {
    const { id } = useParams();
    auth.protect();
  return (
    <div>
        {children}
    </div>
  )
}

export default DocLayout
