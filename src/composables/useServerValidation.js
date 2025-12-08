import { useI18n } from 'vue-i18n'

const useServerValidation = () => {
  const { t } = useI18n()

  const getValidationMessages = field => {
    const messages = Object.keys(field).map(key => t(`validations.${key}`))

    return messages.join('\n')
  }

  const handleFormErrors = (errors, setError) => {
    Object.keys(errors).forEach(errorField => {
      setError(errorField, getValidationMessages(errors[errorField]))
    })
  }

  return { getValidationMessages, handleFormErrors }
}

export default useServerValidation
