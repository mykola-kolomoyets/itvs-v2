import { memo } from 'react';
import type { GoogleDriveVideoPlayerProps } from './types';

const GoogleDriveVideoPlayer: React.FC<GoogleDriveVideoPlayerProps> = ({ url }) => {
    return (
        <div className="relative m-auto mt-8 w-full overflow-hidden rounded-lg px-8 pb-[56.25%]">
            <iframe
                className="absolute left-0 top-0"
                src={url}
                width="100%"
                height="100%"
                allow="autoplay; fullscreen; picture-in-picture"
            />
        </div>
    );
};

export default memo(GoogleDriveVideoPlayer);
