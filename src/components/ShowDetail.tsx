import React from "react"
import ShowPasswordIcon from "./icons/ShowPasswordIcon"
import SecondaryBtn from "./SecondaryBtn"
import { useTranslation } from "react-i18next"

function ShowDetail() {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <ShowPasswordIcon className="hidden md:block" />
      <SecondaryBtn className="block w-full md:hidden">
        {t("detail")}
      </SecondaryBtn>
    </div>
  )
}

export default ShowDetail
