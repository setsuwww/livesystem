import AttendanceForm from "./CheckinForm"
import ContentForm from '@/_components/content/ContentForm';

export default function page() {
  return (
    <ContentForm>
      <AttendanceForm />
    </ContentForm>
  )
}