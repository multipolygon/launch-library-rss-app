import FileCodeIcon from 'mdi-material-ui/FileCode';
import FileDocumentIcon from 'mdi-material-ui/FileDocument';
import FileLinkIcon from 'mdi-material-ui/FileLink';
import GitIcon from 'mdi-material-ui/Github';

const iconMap = {
    xml: FileCodeIcon,
    json: FileLinkIcon,
    yaml: FileDocumentIcon,
    git: GitIcon,
};

export default function FileIcon({ type }) {
    const Icon = iconMap[type];
    return <Icon />;
}
