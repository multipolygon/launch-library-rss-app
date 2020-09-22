import FavouriteIcon from 'mdi-material-ui/Star';
import ArchiveIcon from 'mdi-material-ui/Archive';
import QueueIcon from 'mdi-material-ui/InboxArrowDown';
import OriginalIcon from 'mdi-material-ui/Xml';

export default function CategoryIcon({ category }) {
    return (
        <>
            {category === 'queue' && <QueueIcon />}
            {category === 'favourite' && <FavouriteIcon />}
            {category === 'archive' && <ArchiveIcon />}
            {category === 'original' && <OriginalIcon />}
        </>
    );
}
