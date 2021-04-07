import React, { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

interface Props {
    
}

function About({}: Props): ReactElement {
  const { t } = useTranslation('common')

    return (
        <div>
            About
            <p>{t('description')}</p>
        </div>
    )
}

export default About

export const getStaticProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale, ['common']),
    }
  })
  