import type { ObjKeys, WithChildren } from '@/types';
import { motion } from 'framer-motion';

// Word wrapper
const Wrapper: React.FC<WithChildren<unknown>> = ({ children }) => {
    // We'll do this to prevent wrapping of words using CSS
    return <span className="whitespace-pre">{children}</span>;
};

// Map API "type" vaules to JSX tag names
const ANIMATED_TEXT_TAGS = {
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    span: 'span',
};

// AnimatedCharacters
// Handles the deconstruction of each word and character to setup for the
// individual character animations
const AnimatedCharacters: React.FC<{
    text: string;
    type: ObjKeys<typeof ANIMATED_TEXT_TAGS>;
}> = ({ text, type }) => {
    // Framer Motion variant object, for controlling animation
    const item = {
        hidden: {
            y: '200%',
            // color: '#0055FF',
            transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 1.5 },
        },
        visible: {
            y: 0,
            // color: '#FF0088',
            transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 1.5 },
        },
    };

    //  Split each word of props.text into an array
    const splitWords = text.split(' ');

    // Create storage array
    const words = [];

    // Push each word into words array
    for (const [, item] of splitWords.entries()) {
        words.push(item.split(''));
    }

    // Add a space ("\u00A0") to the end of each word
    words.map((word) => {
        return word.push('\u00A0');
    });

    // Get the tag name from tagMap
    const Tag = ANIMATED_TEXT_TAGS[type] as keyof JSX.IntrinsicElements;

    return (
        <Tag>
            {words.map((word, index) => {
                return (
                    <Wrapper key={index}>
                        {word.flat().map((element, index) => {
                            return (
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        display: 'inline-block',
                                    }}
                                    key={index}
                                >
                                    <motion.span
                                        style={{ display: 'inline-block' }}
                                        className="will-change-transform"
                                        variants={item}
                                    >
                                        {element}
                                    </motion.span>
                                </span>
                            );
                        })}
                    </Wrapper>
                );
            })}
            {/* {} */}
        </Tag>
    );
};

export default AnimatedCharacters;
