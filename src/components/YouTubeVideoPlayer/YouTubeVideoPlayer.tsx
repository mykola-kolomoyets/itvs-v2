import { memo } from 'react';
import ReactPlayer from 'react-player';
import type { YouTubeVideoPlayerProps } from './types';

const YouTubeVideoPlayer: React.FC<YouTubeVideoPlayerProps> = ({ url, poster }) => {
    return (
        <div className="relative m-auto mt-8 w-full overflow-hidden rounded-lg px-8 pb-[56.25%]">
            <ReactPlayer
                className="absolute left-0 top-0"
                width="100%"
                height="100%"
                url={url}
                controls
                style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                }}
                light={poster}
                pip
                config={{
                    youtube: {
                        playerVars: { showinfo: 0, autoplay: 0, fs: 1 },
                        embedOptions: {
                            poster: poster,
                        },
                    },
                    file: {
                        attributes: {
                            poster: poster,
                        },
                    },
                }}
            />
            <source src={url} type="video/mp4" />
        </div>
    );
};

export default memo(YouTubeVideoPlayer);
