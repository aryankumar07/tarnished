import { BackgroundSelector } from "../../../../components/background_selector"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackgroundSelector>
      <div className="m-0 p-0 sm:p-8 md:p-12 flex justify-center items-center">
        <div className="w-full sm:w-[600px] min-w-[100px] flex-shrink-0 max-w-[90vw] mx-auto p-1">
          {children}
        </div>
      </div >
    </BackgroundSelector >

  )
}

export default Layout
