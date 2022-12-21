export default function DownloadUserManual() {
    return (
        <a onClick={() => {
            window.open('/public/xlsx/用户手册.pdf')
        }}>点击下载用户手册</a>
    )
}
