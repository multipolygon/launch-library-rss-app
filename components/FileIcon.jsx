import FileCodeIcon from 'mdi-material-ui/FileCode';
import FileDocumentIcon from 'mdi-material-ui/FileDocument';
import GitIcon from 'mdi-material-ui/Github';

const iconMap = {
    xml: FileCodeIcon,
    json: FileDocumentIcon,
    yaml: FileDocumentIcon,
    git: GitIcon,
};

export default function FileIcon({ type }) {
    const Icon = iconMap[type];
    return <Icon />;
}
